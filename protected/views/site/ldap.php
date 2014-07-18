<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Users';
$date = file_get_contents('ldap_sync.txt');

?>

<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 class="content-title">Users</h2><hr>
                        </div> 
                        <input type="hidden" id="ldap-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
				        <div class="table-header-block">
				            <div class="header-block-button">
				                <a id="ldap-sync-button" class="button round blue image-right ic-add text-upper" href="#">Sync w/ LDAP</a>
				            </div><!-- End Header Block Button -->
				            <div style="float:left;padding:8px;">
					            <span>Last updated </span>
					            <span><b id="ldap-updated"><?= htmlentities($date, ENT_QUOTES, "UTF-8") ?></b></span>
				        	</div>
				        </div><!-- End Table Header Block -->
                        <div id="ldap-lists-container"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

